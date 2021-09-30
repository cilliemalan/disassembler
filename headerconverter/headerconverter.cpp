#include <clang-c/Index.h>
#include <vector>
#include <functional>
#include <tuple>
#include <unordered_map>

// represents an enum value
struct enumeration
{
    // the name of the enumeration
    std::string name;

    // the constant value of the enumeration
    int value;
};

// a grouping of enum values
struct grouping
{
    // the name of the grouping
    std::string name;

    // the values in the grouping
    std::vector<enumeration> values;
};

// copies a CXString to a std::string
static inline std::string to_string(CXString str)
{
    auto cstr = clang_getCString(str);
    std::string result(cstr);
    clang_disposeString(str);
    return result;
}

// allows a visitor function that can capture stuff
typedef std::function<enum CXChildVisitResult(CXCursor cursor, CXCursor parent)> VisitorFunction;
static unsigned int visitChildren(CXCursor cursor, VisitorFunction fn)
{
    static auto invoker = [](CXCursor cursor, CXCursor parent, CXClientData client_data)
    {
        enum CXChildVisitResult result;

        result = (*reinterpret_cast<VisitorFunction *>(client_data))(cursor, parent);

        return result;
    };

    return clang_visitChildren(cursor, invoker, &fn);
}

static void trim_common_front(std::vector<enumeration> &values)
{
    if (!values.empty())
    {
        std::string &first = values[0].name;
        int commonchars = first.size();
        for (const auto &value : values)
        {
            for (int i = 0; i < commonchars; i++)
            {
                if (value.name[i] != first[i])
                {
                    commonchars = i;
                    break;
                }
            }
            if (commonchars == 0)
            {
                break;
            }
        }

        for (auto &value : values)
        {
            value.name.erase(value.name.begin(), value.name.begin() + commonchars);
            if (std::isdigit(value.name.front()))
            {
                value.name.insert(value.name.begin(), '_');
            }
        }
    }
}

int main(int argc, const char **argv)
{
    CXIndex index = clang_createIndex(0, 0);

    std::unordered_map<std::string, grouping> groupings;

    for (int i = 1; i < argc; i++)
    {
        auto unit = clang_parseTranslationUnit(
            index,
            argv[i], nullptr, 0,
            nullptr, 0,
            CXTranslationUnit_None);

        if (unit)
        {
            auto cursor = clang_getTranslationUnitCursor(unit);

            visitChildren(
                cursor,
                [&](CXCursor c, CXCursor parent)
                {
                    auto kind = clang_getCursorKind(c);
                    if (kind == CXCursor_EnumDecl)
                    {
                        auto name = to_string(clang_getCursorDisplayName(c));
                        if (!name.empty())
                        {
                            auto already = groupings.find(name);
                            if (already == groupings.end())
                            {
                                // create a new grouping
                                grouping grouping;
                                grouping.name = name;

                                visitChildren(
                                    c,
                                    [&](CXCursor c, CXCursor parent)
                                    {
                                        auto kind = clang_getCursorKind(c);
                                        if (kind == CXCursor_EnumConstantDecl)
                                        {
                                            grouping.values.push_back({
                                                to_string(clang_getCursorDisplayName(c)),
                                                static_cast<int>(clang_getEnumConstantDeclValue(c)),
                                            });
                                        }
                                        return CXChildVisit_Continue;
                                    });

                                trim_common_front(grouping.values);
                                if (!grouping.values.empty())
                                {
                                    groupings.emplace(std::make_pair(std::move(name), std::move(grouping)));
                                }
                            }
                        }
                    }
                    return CXChildVisit_Continue;
                });
        }

        for (const auto &grouping_pair : groupings)
        {
            auto &grouping = grouping_pair.second;
            printf("export enum %s {\n", grouping_pair.first.c_str());
            int pv = -1;
            for (const auto &value : grouping.values)
            {
                if (value.value != pv + 1)
                {
                    printf("\t%s = %d,\n",
                           value.name.c_str(),
                           value.value);
                }
                else
                {
                    printf("\t%s,\n", value.name.c_str());
                }

                pv = value.value;
            }
            printf("};\n\n");
        }

        clang_disposeTranslationUnit(unit);
    }

    clang_disposeIndex(index);
}